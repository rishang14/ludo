import { createClient, type RedisClientType } from "redis";
import { redisConfig } from "../../../utils/redisConfig";

export class RedisInstance {
  private static  client: RedisClientType | null=null;

  public static async initialize(){
    if (this.client) {
      return;
    }

    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    });      
    
    this.client.on('connect',()=>{
        console.log("redis is connected ")
    })   
    
    this.client.on("error",(err)=>{
        console.log(err)
    })  
    
    await this.client.connect();
  }
}
