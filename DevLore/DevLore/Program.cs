using DevLore.Data;
using DevLore.EntitiesLibrary.Data;
using DevLore.EntitiesLibrary.Middleware;
using DevLore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
    .AddEnvironmentVariables();

// Добавляем CORS ДО вызова builder.Build()
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5174")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// JWT Authentication
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "your-secret-key-at-least-32-characters-long";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

RegisterCoreServices(builder.Services);
RegisterDataSources(builder.Services);

var app = builder.Build();

app.UseMiddleware<ExceptionHandler>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(); // Используем CORS после builder.Build()
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

await InitializeDataSources(app);

app.Run();

void RegisterCoreServices(IServiceCollection services)
{
    services.AddScoped<CommentService>();
    services.AddScoped<PostService>();
    services.AddScoped<ReactionService>();
    services.AddScoped<RoleService>();
    services.AddScoped<TagService>();
    services.AddScoped<UserService>();
    services.AddScoped<FollowService>();
}

void RegisterDataSources(IServiceCollection services)
{
    var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
    var dbName = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "devloredb";
    var dbUser = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
    var dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "123Secret_a";
    var connectionString = $"Server={dbHost};Port=5432;Database={dbName};User Id={dbUser};Password={dbPassword};";
    services.AddScoped(provider => new DataContext(new ContextConfiguration(connectionString, "DevLoreAPI")));
}

async Task InitializeDataSources(WebApplication application)
{
    using var scope = application.Services.CreateScope();
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    await dataContext.TryInitializeAsync();
}