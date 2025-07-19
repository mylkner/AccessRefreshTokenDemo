using Microsoft.EntityFrameworkCore;
using Server.Data.Schema;

namespace Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserRefreshToken> UserRefreshTokens { get; set; } = null!;
}
