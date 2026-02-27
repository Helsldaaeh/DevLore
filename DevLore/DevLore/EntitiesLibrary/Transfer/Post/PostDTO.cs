using DevLore.EntitiesLibrary.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevLore.EntitiesLibrary.Transfer
{
    public record class PostDTO : IdentifiableEntityDTO
    {
        public int UserId { get; set; }
        public string Content { get; set; } = "";
    }
}
