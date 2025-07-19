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

        if (exception is CustomExceptionBase customException && customException.UserSafe)
        {
            errorRes.Detail = customException.Message;
            errorRes.Status = customException.StatusCode;
            errorRes.Title = customException.GetType().Name.Replace("Exception", "");
        }
        else if (env.IsDevelopment())
        {
            errorRes.Detail = exception.Message;
            errorRes.Status = (int)HttpStatusCode.InternalServerError;
            errorRes.Title = "Internal Server Error";
        }
        else
        {
            errorRes.Detail = "An internal server error has occurred.";
            errorRes.Status = (int)HttpStatusCode.InternalServerError;
            errorRes.Title = "Internal Server Error";
        }

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
