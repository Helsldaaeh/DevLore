using DevLore.EntitiesLibrary.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevLore.EntitiesLibrary.Transfer
{
    public static class PostMapper
    {
        public static Post ToEntity(this RequestPostDTO common)
        {
            return new Post {
            Id = common.Id,
            UserId = common.UserId,
            Content = common.Content
            };
        }


        public static PostDTO ToDTO(this Post common)
        {
            return new PostDTO
            {
                Id = common.Id,
                UserId = common.UserId,
                Content = common.Content,
                CreatedAt = common.CreatedAt,
                UpdatedAt = common.UpdatedAt
            };
        }
    }
}
