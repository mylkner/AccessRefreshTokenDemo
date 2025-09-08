using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Server.Errors;

public abstract class CustomExceptionBase : Exception
{
    public bool UserSafe { get; }
    public int StatusCode { get; }

    public CustomExceptionBase(int statusCode, string message, bool userSafe) : base(message)
    {
        UserSafe = userSafe;
        StatusCode = statusCode;
    }

    public ProblemDetails ToProblemDetails(HttpContext context, bool envIsDev)
    {
        return new ProblemDetails()
        {
            Type = $"https://httpstatuses.com/{StatusCode}",
            Status = StatusCode,
            Title = ReasonPhrases.GetReasonPhrase(StatusCode),
            Detail = (UserSafe || envIsDev) ? Message : "An error occurred",
            Instance = context.Request.Path,
            Extensions = { ["traceId"] = context.TraceIdentifier }
        };
    }
}