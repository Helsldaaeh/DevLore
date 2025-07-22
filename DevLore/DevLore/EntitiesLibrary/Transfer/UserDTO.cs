using DevLore.EntitiesLibrary.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevLore.EntitiesLibrary.Transfer
{
    public record class UserDTO : IdentifiableEntityDTO
    {
        public string Profile { get; set; } = "";
        public string Hashed_password { get; set; }
        public string Username { get; set; }
    }
}
