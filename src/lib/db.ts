import mongoose from "mongoose"

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}
export const db =async():Promise<void> =>{

    if(connection.isConnected){
        console.log("Database is already connected")
        return
    }
    try {

        const db=await mongoose.connect(process.env.MONGO_URI || '',{})

        connection.isConnected=db.connections[0].readyState
        console.log("Database is connected")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}