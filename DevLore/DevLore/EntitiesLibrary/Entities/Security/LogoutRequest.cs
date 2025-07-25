using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntitiesLibrary.Entities.Security
{
    public class LogoutRequest
    {
        public required string Email { get; set; }
    }
}
