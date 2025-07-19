using Server.Data.Schema;
using Server.Models;

namespace Server.Services.Interfaces;

public interface IAuthService
{
    public Task RegisterAsync(UserDto req);
    public Task<string> LoginAsync(UserDto req, HttpContext context);
    public Task LogoutAsync(HttpContext context);
    public Task DeleteAsync(HttpContext context);
    public Task<string> ValidateAndReplaceRefreshTokenAsync(HttpContext context);
}
