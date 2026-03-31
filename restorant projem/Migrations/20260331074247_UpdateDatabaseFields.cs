using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace restorant_projem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantMenu_Restaurant_RestaurantID",
                table: "RestaurantMenu");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RestaurantMenu",
                table: "RestaurantMenu");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Restaurant",
                table: "Restaurant");

            migrationBuilder.RenameTable(
                name: "RestaurantMenu",
                newName: "RestaurantMenus");

            migrationBuilder.RenameTable(
                name: "Restaurant",
                newName: "Restaurants");

            migrationBuilder.RenameIndex(
                name: "IX_RestaurantMenu_RestaurantID",
                table: "RestaurantMenus",
                newName: "IX_RestaurantMenus_RestaurantID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RestaurantMenus",
                table: "RestaurantMenus",
                column: "MenuID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Restaurants",
                table: "Restaurants",
                column: "RestaurantID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantMenus_Restaurants_RestaurantID",
                table: "RestaurantMenus",
                column: "RestaurantID",
                principalTable: "Restaurants",
                principalColumn: "RestaurantID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantMenus_Restaurants_RestaurantID",
                table: "RestaurantMenus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Restaurants",
                table: "Restaurants");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RestaurantMenus",
                table: "RestaurantMenus");

            migrationBuilder.RenameTable(
                name: "Restaurants",
                newName: "Restaurant");

            migrationBuilder.RenameTable(
                name: "RestaurantMenus",
                newName: "RestaurantMenu");

            migrationBuilder.RenameIndex(
                name: "IX_RestaurantMenus_RestaurantID",
                table: "RestaurantMenu",
                newName: "IX_RestaurantMenu_RestaurantID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Restaurant",
                table: "Restaurant",
                column: "RestaurantID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RestaurantMenu",
                table: "RestaurantMenu",
                column: "MenuID");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantMenu_Restaurant_RestaurantID",
                table: "RestaurantMenu",
                column: "RestaurantID",
                principalTable: "Restaurant",
                principalColumn: "RestaurantID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
