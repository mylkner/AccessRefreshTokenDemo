using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Data.Schema;
using Server.Errors;
using Server.Helpers;
using Server.Models;
using Server.Services.Interfaces;

namespace Server.Services;

public class AuthService(AppDbContext db, IConfiguration configuration) : IAuthService
{
    public async Task RegisterAsync(UserDto req)
    {
        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            throw new BadRequestException("Username already exists.", userSafe: true);

        string salt = AuthHelpers.GenerateRandomString(16);
        db.Users.Add(
            new()
            {
                Username = req.Username,
                HashedPassword = Convert.ToBase64String(
                    AuthHelpers.HashString(req.Password, Convert.FromBase64String(salt))
                ),
                Salt = AuthHelpers.GenerateRandomString(16),
                Role = "User",
            }
        );
        await db.SaveChangesAsync();
    }

    public async Task<string> LoginAsync(UserDto req, HttpContext context)
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (
            user is null
            || !AuthHelpers.VerifyHash(
                req.Password,
                user.HashedPassword,
                Convert.FromBase64String(user.Salt)
            )
        )
            throw new BadRequestException("Invalid username or password.", userSafe: true);

        await AuthHelpers.GenerateAndSaveRefreshTokenAsync(user, context, db);
        return AuthHelpers.GenerateToken(user, configuration);
    }

    public async Task LogoutAsync(HttpContext context)
    {
        User? user =
            await db
                .Users.Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u =>
                    u.Id == Guid.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)!.Value)
                ) ?? throw new BadRequestException("User not found.");

        RefreshTokenDto refreshToken = AuthHelpers.ParseRefreshToken(context)!;
        UserRefreshToken? userRefreshToken = user.RefreshTokens.Find(rt =>
            rt.Id == Guid.Parse(refreshToken.TokenId)
        );

        if (userRefreshToken is not null)
        {
            db.UserRefreshTokens.Remove(userRefreshToken);
            await db.SaveChangesAsync();
        }

        context.Response.Cookies.Delete("refreshToken");
    }

    public async Task DeleteAsync(HttpContext context)
    {
        User? user =
            await db
                .Users.Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u =>
                    u.Id == Guid.Parse(context.User.FindFirst(ClaimTypes.NameIdentifier)!.Value)
                ) ?? throw new BadRequestException("User not found.");

        db.UserRefreshTokens.RemoveRange(user.RefreshTokens);
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        context.Response.Cookies.Delete("refreshToken");
    }

    public async Task<string> ValidateAndReplaceRefreshTokenAsync(HttpContext context)
    {
        RefreshTokenDto refreshToken = AuthHelpers.ParseRefreshToken(context)!;

        UserRefreshToken? userRefreshToken =
            await db
                .UserRefreshTokens.Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Id == Guid.Parse(refreshToken.TokenId))
            ?? throw new UnauthorizedException("Missing refresh token from db.");

        db.UserRefreshTokens.Remove(userRefreshToken);
        if (
            userRefreshToken.Expiry <= DateTime.UtcNow
            || !AuthHelpers.VerifyHash(
                refreshToken.TokenValue,
                userRefreshToken.RefreshToken,
                Convert.FromBase64String(userRefreshToken.Salt)
            )
        )
        {
            await db.SaveChangesAsync();
            throw new UnauthorizedException("Invalid refresh token.");
        }
        await AuthHelpers.GenerateAndSaveRefreshTokenAsync(userRefreshToken.User, context, db);
        return AuthHelpers.GenerateToken(userRefreshToken.User, configuration);
    }
}
