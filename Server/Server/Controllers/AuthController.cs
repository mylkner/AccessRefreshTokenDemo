using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services.Interfaces;

namespace Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<string>> Register(UserDto userDto)
    {
        await authService.RegisterAsync(userDto);
        return Created();
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login(UserDto userDto)
    {
        string jwt = await authService.LoginAsync(userDto, HttpContext);
        return Ok(jwt);
    }

    [HttpGet("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await authService.LogoutAsync(HttpContext);
        return NoContent();
    }

    [HttpDelete("delete")]
    [Authorize]
    public async Task<IActionResult> Delete()
    {
        await authService.DeleteAsync(HttpContext);
        return NoContent();
    }

    [HttpGet("refresh-token")]
    public async Task<ActionResult<string>> RefreshToken()
    {
        string jwt = await authService.ValidateAndReplaceRefreshTokenAsync(HttpContext);
        return Ok(jwt);
    }

    [HttpPut("change-role")]
    [Authorize]
    public async Task<ActionResult<string>> ChangeRoleEndpoint()
    {
        string jwt = await authService.ChangeRole(HttpContext);
        return Ok(jwt);
    }

    [HttpGet]
    [Authorize]
    public IActionResult AuthEndpoint()
    {
        return Ok("This is the auth endpoint.");
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult AdminEndpoint()
    {
        return Ok("This is the admin endpoint.");
    }
}
