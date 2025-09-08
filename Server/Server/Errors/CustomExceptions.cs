using System.Net;

namespace Server.Errors;

public class BadRequestException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.BadRequest, message, userSafe);

public class UnauthorizedException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.Unauthorized, message, userSafe);

public class RefreshTokenException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.Unauthorized, message, userSafe);

public class ForbiddenException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.Forbidden, message, userSafe);

public class NotFoundException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.NotFound, message, userSafe);

public class InternalServerErrorException(string message, bool userSafe = false)
    : CustomExceptionBase((int)HttpStatusCode.InternalServerError, message, userSafe);