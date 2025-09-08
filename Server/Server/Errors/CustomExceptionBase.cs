using Microsoft.AspNetCore.WebUtilities;

namespace Server.Errors;
public abstract class CustomExceptionBase : Exception
{
    public bool UserSafe { get; }
    public int StatusCode { get; }
    public string Title { get; }
    public string? Detail { get; set; }
    public string? Instance { get; set; }
    public string? TraceId { get; set; }

    public CustomExceptionBase(int statusCode, string message, bool userSafe) : base(message)
    {
        UserSafe = userSafe;
        StatusCode = statusCode;
        Title = ReasonPhrases.GetReasonPhrase(StatusCode);
    }
    
    public void SetDetails(HttpContext context, bool envIsDev)
    {
        Detail = (UserSafe || envIsDev) ? Message : "An error occurred";
        Instance = context.Request.Path;
        TraceId = context.TraceIdentifier;
    }
}