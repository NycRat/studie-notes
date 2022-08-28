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

        match user_coll.find_one(doc! {"is_class_list": true}, None).await {
            Ok(option_doc) => {
                if let Some(doc) = option_doc {
                    match doc.get_array("class_list") {
                        Ok(class_list) => {
                            let json = json!({ "data": class_list });
                            match serde_json::to_string(&json) {
                                Ok(json_str) => {
                                    return json_str;
                                }
                                Err(err) => {
                                    println!("{:?}", err);
                                }
                            }
                        }
                        Err(err) => {
                            println!("{:?}", err);
                        }
                    }
                }
            }
            Err(err) => {
                println!("{:?}", err);
            }
        }

        return "{\"data\": []}".to_owned();
    }
}
