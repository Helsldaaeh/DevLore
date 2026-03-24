using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Services;
using DevLore.Data;

namespace DevLore.Services
{
    public class TagService(DataContext dataContext) : DataEntityService<Tag>(dataContext) { }
}