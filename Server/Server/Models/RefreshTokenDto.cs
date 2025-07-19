namespace Server.Models;

public class RefreshTokenDto
{
    public string TokenId { get; set; } = string.Empty;
    public string TokenValue { get; set; } = string.Empty;
}
