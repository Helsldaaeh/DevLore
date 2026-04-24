using DevLore.EntitiesLibrary.Entities.Common;
using DevLore.EntitiesLibrary.Transfer;

namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public record class PostDTO : IdentifiableEntityDTO
    {
        public int UserId { get; set; }
        public string Username { get; set; } = "";
        public string Content { get; set; } = "";
        public PostType Type { get; set; }
        public int? OriginalPostId { get; set; }
        public PostDTO? OriginalPost { get; set; }
        public List<string>? Tags { get; set; }
        public bool IsRepost { get; set; }           // добавлено
        public bool IsOriginalDeleted { get; set; }
    }
}