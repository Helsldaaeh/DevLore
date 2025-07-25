﻿using DevLore.EntitiesLibrary.Entities.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevLore.EntitiesLibrary.Transfer
{
    public static class UserMapper
    {
        public static User ToEntity(this RequestUserDTO common)
        {
            return new User
            {
                Id = common.Id,
                Username = common.Username,
                Profile = common.Profile
            };
        }


        public static UserDTO ToDTO(this User common)
        {
            return new UserDTO
            {
                CreatedAt = common.CreatedAt,
                UpdatedAt = common.UpdatedAt,
                Id = common.Id,
                Username = common.Username,
                Profile = common.Profile
            };
        }
    }
}
