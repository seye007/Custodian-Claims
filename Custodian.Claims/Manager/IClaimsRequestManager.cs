using Custodian.Claims.Dto.Request;
using Custodian.Claims.Dto.Response;

namespace Custodian.Claims.ClaimsProcessing
{
    public interface IClaimsRequestManager
	{
		ResponseBase<ClaimStatusResponse> ClaimRetrievalByClaimNumber(string claimNumber);
		ResponseBase<string> SaveClaimRequest(ClaimRequest claimRequest);
	}
}