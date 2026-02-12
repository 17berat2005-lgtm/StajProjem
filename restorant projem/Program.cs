using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;
using restorant_projem.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
var app = builder.Build();
app.UseStaticFiles();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        try
        {
            context.Database.Migrate();
        }
        catch
        {
        }

        var createCategoriesSql = @"
IF OBJECT_ID(N'[dbo].[Categories]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Categories](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Name] NVARCHAR(100) NOT NULL
    );
END

IF COL_LENGTH('MenuDetails', 'CategoryId') IS NULL
BEGIN
    ALTER TABLE [dbo].[MenuDetails]
    ADD [CategoryId] INT NULL;

    ALTER TABLE [dbo].[MenuDetails] WITH CHECK ADD CONSTRAINT [FK_MenuDetails_Categories_CategoryId]
    FOREIGN KEY([CategoryId]) REFERENCES [dbo].[Categories]([Id]) ON DELETE SET NULL;

    CREATE INDEX [IX_MenuDetails_CategoryId] ON [dbo].[MenuDetails]([CategoryId]);
END
";

        try
        {
            context.Database.ExecuteSqlRaw(createCategoriesSql);
        }
        catch
        {
        }

        var createOrdersSql = @"
IF OBJECT_ID(N'[dbo].[Orders]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Orders](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [TotalAmount] DECIMAL(18,2) NOT NULL,
        [Status] NVARCHAR(MAX) NOT NULL,
        [CreatedDate] DATETIME2 NOT NULL,
        [Notes] NVARCHAR(MAX) NULL
    );

    ALTER TABLE [dbo].[Orders] WITH CHECK ADD CONSTRAINT [FK_Orders_Users_UserId]
    FOREIGN KEY([UserId]) REFERENCES [dbo].[Users]([ID]) ON DELETE CASCADE;

    CREATE INDEX [IX_Orders_UserId] ON [dbo].[Orders]([UserId]);
END

IF OBJECT_ID(N'[dbo].[OrderItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[OrderItems](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [OrderId] INT NOT NULL,
        [MenuDetailId] INT NOT NULL,
        [Quantity] INT NOT NULL,
        [UnitPrice] DECIMAL(18,2) NOT NULL,
        [SubTotal] DECIMAL(18,2) NOT NULL
    );

    ALTER TABLE [dbo].[OrderItems] WITH CHECK ADD CONSTRAINT [FK_OrderItems_Orders_OrderId]
    FOREIGN KEY([OrderId]) REFERENCES [dbo].[Orders]([Id]) ON DELETE CASCADE;

    ALTER TABLE [dbo].[OrderItems] WITH CHECK ADD CONSTRAINT [FK_OrderItems_MenuDetails_MenuDetailId]
    FOREIGN KEY([MenuDetailId]) REFERENCES [dbo].[MenuDetails]([Id]) ON DELETE CASCADE;

    CREATE INDEX [IX_OrderItems_OrderId] ON [dbo].[OrderItems]([OrderId]);
    CREATE INDEX [IX_OrderItems_MenuDetailId] ON [dbo].[OrderItems]([MenuDetailId]);
END
";

        try
        {
            context.Database.ExecuteSqlRaw(createOrdersSql);
        }
        catch
        {
        }

        if (!context.Users.Any(u => u.Role == "SuperAdmin"))
        {
            var superAdmin = new User
            {
                Username = "superadmin",
                Password = "1234",
                Role = "SuperAdmin",
                CreatedDate = DateTime.Now
            };

            context.Users.Add(superAdmin);
            context.SaveChanges();
        }

        var now = DateTime.Now;

        var seedCategories = new[]
        {
            "Ana Yemek",
            "Tatli",
            "Icecek",
            "Baslangic",
            "Salata"
        };

        foreach (var catName in seedCategories)
        {
            if (!context.Categories.Any(c => c.Name == catName))
            {
                context.Categories.Add(new Category { Name = catName });
            }
        }

        context.SaveChanges();

        var categories = context.Categories.ToList();

        var seedMenu = new List<(MenuDetail Item, string CategoryName)>
        {
            (new MenuDetail
            {
                FoodName = "Kanka Burger",
                Description = "Cheddar peynirli, karamelize soganli, ozel soslu gurme burger.",
                Price = 220m,
                Calories = 850,
                IsActive = true,
                CreatedDate = now
            }, "Ana Yemek"),
            (new MenuDetail
            {
                FoodName = "Izgara Bonfile",
                Description = "Izgara sebzeler ve roka salatasi ile servis edilen dana bonfile.",
                Price = 340m,
                Calories = 720,
                IsActive = true,
                CreatedDate = now
            }, "Ana Yemek"),
            (new MenuDetail
            {
                FoodName = "Truffle Makarna",
                Description = "Krema soslu, mantarli ve truffle yagli taze feslegenli makarna.",
                Price = 260m,
                Calories = 680,
                IsActive = true,
                CreatedDate = now
            }, "Ana Yemek"),
            (new MenuDetail
            {
                FoodName = "Fit Tavuk Bowl",
                Description = "Izgara tavuk, kinoali yesil salata ve avokado ile hafif bowl.",
                Price = 195m,
                Calories = 540,
                IsActive = true,
                CreatedDate = now
            }, "Salata"),
            (new MenuDetail
            {
                FoodName = "Cheesecake",
                Description = "Cilek soslu New York usulu cheesecake.",
                Price = 145m,
                Calories = 430,
                IsActive = true,
                CreatedDate = now
            }, "Tatli")
        };

        var addedAny = false;
        foreach (var (item, categoryName) in seedMenu)
        {
            if (!context.MenuDetails.Any(m => m.FoodName == item.FoodName))
            {
                var category = categories.FirstOrDefault(c => c.Name == categoryName);
                if (category != null)
                {
                    item.CategoryId = category.Id;
                }

                context.MenuDetails.Add(item);
                addedAny = true;
            }
        }

        if (addedAny)
        {
            context.SaveChanges();
        }
    }
    catch (Exception)
    {
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
