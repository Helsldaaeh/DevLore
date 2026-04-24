using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLore.Migrations
{
    /// <inheritdoc />
    public partial class AddIsRepostFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRepost",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRepost",
                table: "Posts");
        }
    }
}
