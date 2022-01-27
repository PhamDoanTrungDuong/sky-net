using System;

namespace API.Errors
{
    public class ApiRespone
    {
        public ApiRespone(int statusCode, string message = null)
        {
            StausCode = statusCode;
            Message = message ?? GetDefaultMessage(statusCode);
        }

        public int StausCode { get; set; }
        
        public string Message { get; set; }
        
        private string GetDefaultMessage(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Authorized, you are not",
                404 => "Resource found, it was not",
                500 => "Errors are the path to the dark side. Errors lead to anger. Anger leads to hate. Hate leads to  career change",
                _ => null
            };
        }
    }
}