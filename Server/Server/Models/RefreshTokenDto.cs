namespace Server.Models;

public class RefreshTokenDto
{
    public Guid TokenId { get; set; } = Guid.Empty;
    public string TokenValue { get; set; } = string.Empty;
}
