namespace CodeSnippetManager.API
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;

    public class ApiKeyAttribute : Attribute, IAsyncActionFilter
    {
        private const string API_KEY_HEADER = "X-Api-Key";

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.HttpContext.Request.Headers.TryGetValue(API_KEY_HEADER, out var extractedApiKey))
            {
                context.Result = new UnauthorizedObjectResult("API Key is missing");
                return;
            }

            var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = configuration.GetValue<string>("ApiKey");

            if (!apiKey.Equals(extractedApiKey))
            {
                context.Result = new UnauthorizedObjectResult("Invalid API Key");
                return;
            }

            await next();
        }
    }
}
