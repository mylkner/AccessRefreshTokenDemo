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
        if (exception is RefreshTokenException) httpContext.Response.Cookies.Delete("refreshToken");

        CustomExceptionBase errorRes =
            exception as CustomExceptionBase ?? new InternalServerErrorException(exception.Message);
        ProblemDetails problemDetails = errorRes.ToProblemDetails(httpContext, env.IsDevelopment());

        logger.LogError(
            exception,
            "Unhandled exception | Trace ID: {TraceIdentifier}",
            problemDetails.Extensions["traceId"]
        );

        httpContext.Response.StatusCode = errorRes.StatusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken: cancellationToken);
        return true;
    }
}
