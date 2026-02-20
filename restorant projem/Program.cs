using Microsoft.EntityFrameworkCore;
using restorant_projem.Data;

var builder = WebApplication.CreateBuilder(args);

// SQL Server ba�lant�s�n� aktif ediyoruz
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
// ... builder.Build'den �nce
var app = builder.Build();
app.UseStaticFiles(); // Bu komut, wwwroot i�indeki index.html'i internete a�ar!

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
