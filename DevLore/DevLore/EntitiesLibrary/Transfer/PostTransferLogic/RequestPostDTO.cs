using DevLore.EntitiesLibrary.Entities.Common;

namespace DevLore.EntitiesLibrary.Transfer.PostTransferLogic
{
    public record class RequestPostDTO
    {
        public int? Id { get; init; }
        public int UserId { get; init; }
        public string Content { get; set; } = "";
        public PostType Type { get; set; }
        public int? OriginalPostId { get; set; }
        public List<string>? Tags { get; set; }
        public bool IsRepost { get; set; }   // добавлено
    }
}