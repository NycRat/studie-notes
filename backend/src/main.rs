#[macro_use]
extern crate rocket;

mod mongo;
use mongo::Mongo;
use rocket::State;

#[get("/classes/list?<user>")]
async fn get_class_list(user: &str, mongo: &State<Mongo>) -> String {
    mongo.get_class_list(user).await
}

#[get("/")]
async fn index() -> &'static str {
    "Hello World"
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
        .mount("/api/", routes![index, get_class_list])
}
