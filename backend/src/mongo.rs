use mongodb::bson::{doc, Document};
use serde_json::json;

pub struct Mongo {
    pub client: mongodb::Client,
}

impl Mongo {
    pub async fn init() -> Self {
        dotenv::dotenv().ok();

        let uri = std::env::var("MONGODB_URI").unwrap();
        let client_options = mongodb::options::ClientOptions::parse(uri).await.unwrap();
        let client = mongodb::Client::with_options(client_options).unwrap();

        Mongo { client }
    }

    pub async fn get_class_list(&self, user: &str) -> String {
        let user_db = self.client.database("userDB");

        let user_coll = user_db.collection::<Document>(&user);

        match user_coll
            .find_one(doc! {"class_list": {"$exists": true}}, None)
            .await
        {
            Ok(option_doc) => {
                if let Some(doc) = option_doc {
                    match doc.get_array("class_list") {
                        Ok(class_list) => {
                            let json = json!({ "data": class_list });
                            match serde_json::to_string(&json) {
                                Ok(json_str) => {
                                    return json_str;
                                }
                                Err(err) => println!("{:?}", err),
                            }
                        }
                        Err(err) => println!("{:?}", err),
                    }
                }
            }
            Err(err) => println!("{:?}", err),
        }

        return "{\"data\": []}".to_owned();
    }

    pub async fn post_new_class(&self, user: &str, class: &str) -> bool {
        let user_db = self.client.database("userDB");

        let user_coll = user_db.collection::<Document>(user);

        let success = true;

        match user_coll
            .insert_one(
                doc! {
                    "class": class,
                    "notes": [],
                    "note_list": []
                },
                None,
            )
            .await
        {
            Ok(_) => {}
            Err(err) => {
                println!("{:?}", err);
                return false;
            }
        }

        let update_doc = doc! {"$push": {"class_list": class}};

        match user_coll
            .update_one(doc! {"class_list": {"$exists": true}}, update_doc, None)
            .await
        {
            Ok(_) => {}
            Err(err) => {
                println!("{:?}", err);
                return false;
            }
        }

        return success;
    }

    pub async fn get_user_list(&self) -> Vec<String> {
        let user_db = self.client.database("userDB");

        match user_db.list_collection_names(None).await {
            Ok(user_list) => {
                return user_list;
            }
            Err(err) => println!("{:?}", err),
        }
        return vec![];
    }

    pub async fn post_new_user(&self, user: &String, password: &String) -> String {
        let user_db = self.client.database("userDB");

        for existing_user in self.get_user_list().await {
            if existing_user == *user {
                return "{\"data\": \"User already exists\"}".to_owned();
            }
        }

        match user_db.create_collection(user, None).await {
            Ok(_) => {
                let user_coll = user_db.collection::<Document>(user);
                match user_coll
                    .insert_many([doc! {"password": password}, doc!{"class_list": []}], None)
                    .await
                {
                    Ok(_) => {
                        println!("USER CREATED: {}", user);
                        return "{\"data\": \"User created\"}".to_owned();
                    }
                    Err(err) => println!("{:?}", err),
                }
            }
            Err(err) => println!("{:?}", err),
        }
        return "{\"data\": \"Failed to create user\"}".to_owned();
    }

    pub async fn get_login(&self, user: &String, password: &String) -> bool {
        if password == "" || user == "" {
            return false;
        }
        let user_db = self.client.database("userDB");
        let user_coll = user_db.collection::<Document>(user);
        match user_coll
            .find_one(doc! {"password": {"$exists": true}}, None)
            .await
        {
            Ok(option_doc) => {
                if let Some(doc) = option_doc {
                    match doc.get_str("password") {
                        Ok(db_password) => {
                            if password == db_password {
                                return true;
                            }
                        }
                        Err(err) => println!("{:?}", err),
                    }
                }
            }
            Err(err) => println!("{:?}", err),
        }

        false
    }

    pub async fn post_new_note(&self, user: &String, class: &str, note_name: &str) -> bool {
        let user_db = self.client.database("userDB");
        let user_coll = user_db.collection::<Document>(user);

        let update_doc = doc! {"$push": {"note_list": note_name}};

        let mut success = true;

        match user_coll.update_one(doc! {"class": class}, update_doc, None).await {
            Ok(_) => {
            }
            Err(err) => {
                success = false;
println!("{:?}", err);
            }
        }

        let update_doc_2 = doc! {"$push": {"notes": ""}};

        match user_coll.update_one(doc! {"class": class}, update_doc_2, None).await {
            Ok(_) => {
            }
            Err(err) => {
println!("{:?}", err);
                success = false;
            }
        }
        return success;
    }

    pub async fn get_notes_list(&self, user: &String, class: &str) -> String {
        let user_db = self.client.database("userDB");
        let user_coll = user_db.collection::<Document>(user);

        match user_coll.find_one(doc! {"class": class}, None).await {
            Ok(option_doc) => {
                if let Some(doc) = option_doc {
                    match doc.get_array("note_list") {
                        Ok(note_list) => {
                            let json = json!({ "data": note_list });
                            match serde_json::to_string(&json) {
                                Ok(json_str) => {
                                    return json_str;
                                }
                                Err(err) => println!("{:?}", err),
                            }
                        }
                        Err(err) => println!("{:?}", err)
                    }
                }
            }
            Err(err) => println!("{:?}", err)
        }

        "{\"data\": []}".to_owned()
    }

    pub async fn get_note_data(&self, user: &String, class: &str, note_name: &str) -> String {
        let user_db = self.client.database("userDB");
        let user_coll = user_db.collection::<Document>(user);

        match user_coll.find_one(doc! {"class": class}, None).await {
            Ok(option_doc) => {
                if let Some(doc) = option_doc {
                    let mut note_index = 0;
                    match doc.get_array("note_list") {
                        Ok(note_list) => {
                            for i in 0..note_list.len() {
                                if let Some(note) = note_list[i].as_str() {
                                    if note == note_name {
                                        note_index = i;
                                        break;
                                    }
                                    if i == note_list.len() - 1 {
                                        return "".to_owned();
                                    }
                                }
                            }
                        }
                        Err(err) => println!("{:?}", err)
                    }
                     
                    match doc.get_array("notes") {
                        Ok(notes) => {
                            let req_note = &notes[note_index];
                            if let Some(note_data) = req_note.as_str() {
                                return note_data.to_owned();
                            }
                        }
                        Err(err) => println!("{:?}", err)
                    }
                }
            }
            Err(err) => println!("{:?}", err)
        }

        "".to_owned()
    }
}
