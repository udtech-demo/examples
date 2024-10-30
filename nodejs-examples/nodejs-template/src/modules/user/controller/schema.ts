import { buildSchema } from "graphql";

const schema = buildSchema(`  
   type MeResp {
       id: String!
       email: String
       firstname: String
       lastname: String
       created_at: String
   }
   
   type Query {
       Me: MeResp
   }
`);

export default schema;