namespace Custodian.Claims.Extensions
{
	public static class RequestPipeline
	{
		public static void ConfigurePipeline(this WebApplication app)
		{
			// Configure the HTTP request pipeline.
			if (!app.Environment.IsDevelopment())
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();

			app.UseRouting();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller=Home}/{action=Index}/{id?}");

				// Add a catch-all route for 404 error
				endpoints.MapFallbackToController("Error", "Home");
			});

			app.Run();
		}
	}
}
