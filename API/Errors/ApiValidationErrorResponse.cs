using System.Collections.Generic;

namespace API.Errors
{
    public class ApiValidationErrorResponse : ApiRespone
    {
        public ApiValidationErrorResponse() : base(400)
        {
        }

        public IEnumerable<string> Errors { get; set; }
    }
}