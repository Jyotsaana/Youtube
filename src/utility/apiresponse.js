// ApiResponse Utility

// Used to send responses in same format everywhere.


class ApiResponse{
   constructor(statusCode,data,message){
      this.statusCode = statusCode
      this.data = data
      this.message = message
      this.success = statusCode < 400
   }
}

export default ApiResponse
