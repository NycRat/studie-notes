#[macro_use]
extern crate rocket;

mod mongo;
use rocket::Data;
use http_auth_basic::Credentials;
use mongo::Mongo;
use rocket::data::ToByteUnit;
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use rocket::State;

struct LoginInfo(Credentials);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for LoginInfo {
    type Error = String;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let auth = request.headers().get_one("Authorization");
        if let Some(encoded_login) = auth {
            match Credentials::from_header(String::from(encoded_login)) {
                Ok(mut decoded_login) => {
                    decoded_login.user_id = decoded_login.user_id.trim().to_owned();
                    decoded_login.password = decoded_login.password.trim().to_owned();
                    if decoded_login.password == "" {
                        return Outcome::Success(LoginInfo(Credentials::new(
                            "{\"data\": \"Password is missing\"}",
                            "",
                        )));
                    }
                    if decoded_login.user_id.len() < 3 {
                        // decoded_login.user_id
                        return Outcome::Success(LoginInfo(Credentials::new(
                            "{\"data\": \"Username has to be at least 3 characters long\"}",
                            "",
                        )));
                    }
                    if decoded_login.user_id.len() > 15 {
                        // decoded_login.user_id
                        return Outcome::Success(LoginInfo(Credentials::new(
                            "{\"data\": \"Username cannot be longer than 15 characters\"}",
                            "",
                        )));
                    }
                    if !decoded_login
                        .user_id
                        .chars()
                        .all(|c| (c.is_ascii() && c.is_alphanumeric()) || c == '_' || c == '.')
                    {
                        return Outcome::Success(LoginInfo(Credentials::new(
                            "{\"data\": \"Username can only contain a-z, A-Z, 0-9, ., _\"}",
                            "",
                        )));
                    }

                    // if decoded_login.user_id. {
                    //     return "{\"data\": \"Username cannot contain special characters and spaces: \"}".to_owned();
                    // }
                    return Outcome::Success(LoginInfo(decoded_login));
                }
                Err(err) => println!("{:?}", err),
            }
        }
        Outcome::Success(LoginInfo(Credentials::new(
            "{\"data\": \"Missing Password or Username\"}",
            "",
        )))
    }
}

#[get("/classes/list?<user>")]
async fn get_class_list(user: &str, mongo: &State<Mongo>) -> String {
    mongo.get_class_list(user).await
}

#[post("/classes/new?<class>")]
async fn post_class_new(class: &str, mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if mongo
        .get_login(&login_info.0.user_id, &login_info.0.password)
        .await
    {
        if mongo.post_new_class(&login_info.0.user_id, class).await {
            return "{\"data\": true}".to_owned();
        }
    }
    "{\"data\": false}".to_owned()
}

#[get("/user/login")]
async fn get_user_login(mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    let has_correct_info = mongo
        .get_login(&login_info.0.user_id, &login_info.0.password)
        .await;
    if has_correct_info {
        return "{\"data\": true}".to_owned();
    }
    return "{\"data\": false}".to_owned();
}

#[post("/user/new")]
async fn post_user_new(mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if login_info.0.password == "" {
        return login_info.0.user_id;
    }
    mongo
        .post_new_user(&login_info.0.user_id, &login_info.0.password)
        .await
}

#[get("/notes/list?<class>")]
async fn get_notes_list(class: &str, mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if !mongo.get_login(&login_info.0.user_id, &login_info.0.password).await {
        return "{\"data\": []}".to_owned();
    }
    return mongo.get_notes_list(&login_info.0.user_id, class).await;
}

#[post("/notes/new?<class>&<note>")]
async fn post_note_new(class: &str, note: &str, mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if !mongo.get_login(&login_info.0.user_id, &login_info.0.password).await {
        return "{\"data\": false}".to_owned();
    }
    if mongo.post_new_note(&login_info.0.user_id, class, note).await {
        return "{\"data\": true}".to_owned();
    }
    return "{\"data\": false}".to_owned();
}

#[get("/notes?<class>&<note>")]
async fn get_note(class: &str, note: &str, mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if !mongo.get_login(&login_info.0.user_id, &login_info.0.password).await {
        return "".to_owned();
    }

    mongo.get_note_data(&login_info.0.user_id, class, note).await
}

#[post("/notes?<class>&<note>", data = "<new_note_data>")]
async fn post_update_note(class: &str, note: &str, new_note_data: Data<'_>, mongo: &State<Mongo>, login_info: LoginInfo) -> String {
    if !mongo.get_login(&login_info.0.user_id, &login_info.0.password).await {
        return "false".to_owned();
    }

    let new_note_data_str;
    match new_note_data.open(10.megabytes()).into_string().await {
        Ok(data) => {
            new_note_data_str = data.value;
            if mongo.update_note_data(&login_info.0.user_id, class, note, &new_note_data_str).await {
                return "true".to_owned();
            }
        } 
        Err(err) => println!("{:?}", err)
    }

    return "false".to_owned();
}

#[launch]
async fn rocket() -> _ {
    use rocket::http::Method;
    use rocket_cors::{AllowedOrigins, CorsOptions};

    let mongo = Mongo::init().await;

    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post, Method::Delete, Method::Options]
                .into_iter()
                .map(From::from)
                .collect(),
        )
        .allow_credentials(true);

    rocket::build()
        .manage(mongo)
        .attach(cors.to_cors().unwrap())
        .mount(
            "/api/",
            routes![get_class_list, post_user_new, get_user_login, post_class_new, get_notes_list, post_note_new, get_note, post_update_note],
        )
}
