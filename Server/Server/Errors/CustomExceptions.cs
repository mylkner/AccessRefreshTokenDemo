using System.Net;

namespace Server.Errors;

public abstract class CustomExceptionBase(string message, bool userSafe, int StatusCode)
    : Exception(message)
{
    public bool UserSafe { get; set; } = userSafe;
    public int StatusCode { get; set; } = StatusCode;
}

public class BadRequestException(string message, bool userSafe = false)
    : CustomExceptionBase(message, userSafe, (int)HttpStatusCode.BadRequest);

public class UnauthorizedException(string message, bool userSafe = false)
    : CustomExceptionBase(message, userSafe, (int)HttpStatusCode.Unauthorized);

public class ForbiddenException(string message, bool userSafe = false)
    : CustomExceptionBase(message, userSafe, (int)HttpStatusCode.Forbidden);

public class NotFoundException(string message, bool userSafe = false)
    : CustomExceptionBase(message, userSafe, (int)HttpStatusCode.NotFound);
