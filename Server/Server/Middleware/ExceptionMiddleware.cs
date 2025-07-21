using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Server.Errors;

namespace Server.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        ProblemDetails errorRes = new();

        if (exception is RefreshTokenException)
            httpContext.Response.Cookies.Delete("refreshToken");

        bool showDetails = !env.IsDevelopment();
        string title = "Internal Server Error";
        int statusCode = (int)HttpStatusCode.InternalServerError;
        string detail = "An error has occurred.";

        if (exception is CustomExceptionBase customException)
        {
            showDetails = showDetails || customException.UserSafe;
            title = showDetails ? customException.GetType().Name.Replace("Exception", "") : title;
            statusCode = showDetails ? customException.StatusCode : statusCode;
            detail = showDetails ? customException.Message : detail;
        }
        else if (showDetails)
        {
            title = exception.GetType().Name.Replace("Exception", "");
            detail = exception.Message;
        }

        errorRes.Status = statusCode;
        errorRes.Detail = detail;
        errorRes.Title = title;

        logger.LogError(
            exception,
            "Unhandled exception | Trace ID: {TraceIdentifier}",
            httpContext.TraceIdentifier
        );

        httpContext.Response.StatusCode = errorRes.Status.Value;
        await httpContext.Response.WriteAsJsonAsync(errorRes, cancellationToken: cancellationToken);
        return true;
    }
}
