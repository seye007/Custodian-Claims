import { Utility } from './utility.js';
import { Api } from './apiHelper.js';

const claimStatusModal = document.getElementById('claimsModal');

const processingModal = document.getElementById('processingModal');

claimStatusModal.addEventListener('click', () => closeModal());

document.getElementById('submitClaim').addEventListener('click', () => showTab('submitClaim'));

document.getElementById('checkStatus').addEventListener('click', () => showTab('checkStatus'));

document.getElementById('checkStatusBtn').addEventListener('click', async (event) => {
  await submitClaimStatusRequest(event);
});

document.getElementById('submitClaimBtn').addEventListener('click', async (event) => {
  await submitClaimRequest(event);
});

window.addEventListener('click', (event) => {
  if (event.target === claimStatusModal) {
    closeModal();
  }
});

function closeModal() {
  claimStatusModal.style.display = 'none';
}

function showProcessingModal() {
  processingModal.style.display = 'flex';
}

function hideProcessingModal() {
  processingModal.style.display = 'none';
}

function showTab(tabName) {
  const forms = document.querySelectorAll('form');
  const tabs = document.querySelectorAll('.tab');

  forms.forEach((form) => form.classList.remove('active'));
  tabs.forEach((tab) => tab.classList.remove('active'));

  const activeForm = document.getElementById(`${tabName}Form`);
  const activeTab = document.getElementById(`${tabName}`);

  activeForm.classList.add('active');
  activeTab.classList.add('active');
}

async function submitClaimRequest(e) {
  e.preventDefault();
  const form = document.getElementById('submitClaimForm');
  const isValid = Utility.validateFormElements(form);

  if (isValid) {
    showProcessingModal();
    try {
      const payload = getClaimRequestPayload();
      const response = await Api.SendAsync('/api/ClaimRequest','POST',payload,handleError);

      if (response) {
        Utility.alertMessage(Utility.icons[1], Utility.titles[1], response.message);
      }
    } catch (error) {
      handleError(error, 'An error occurred while processing your claim request.');
    } finally {
      hideProcessingModal();
    }
  }
}

async function submitClaimStatusRequest(e) {
  e.preventDefault();
  const form = document.getElementById('checkStatusForm');
  const isValid = Utility.validateFormElements(form);

  if (isValid) {
    showProcessingModal();
    try {
      const claimNumber = document.getElementById('claimNumber').value;
      const response = await Api.SendAsync(`/api/CheckClaimStatus?claimNumber=${claimNumber}`,'GET',null,handleError);

      if (response) {
        populateClaimsStatusModal(response);
      }
    } catch (error) {
      handleError(error, 'An error occurred while checking claim status.');
    } finally {
      hideProcessingModal();
    }
  }
}

function populateClaimsStatusModal(response) {
  const policyNumberElement = document.getElementById('policyNumber');
  const statusElement = document.getElementById('status');
  const createdAtElement = document.getElementById('ceatedAt');

  policyNumberElement.textContent = response.data.policyNumber;
  statusElement.textContent = response.data.status;
  createdAtElement.textContent = response.data.createdAt;

  statusElement.className = getStatusClassName(response.data.status);

  claimStatusModal.style.display = 'flex';
}

function getClaimRequestPayload() {
  const policyNumber = document.getElementById('policyNumber').value;
  const emailAddress = document.getElementById('emailAddress').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const claimDescription = document.getElementById('claimDescription').value;

  return {
    PolicyNumber: policyNumber,
    EmailAddress: emailAddress,
    PhoneNumber: phoneNumber,
    Description: claimDescription
  };
}

function getStatusClassName(status) {
  switch (status) {
    case 'Approved':
      return 'status-approved';
    case 'Pending':
      return 'status-pending';
    case 'Denied':
      return 'status-denied';
    default:
      return '';
  }
}

function handleError(response, defaultMessage = null) {
  const statusCode = response ? response.statusCode : null;

  if (!statusCode || !statusCode.toString().startsWith('5')) {
    Utility.alertMessage(Utility.icons[0], Utility.titles[0], response.message);
  } else {
    const errorMessage = defaultMessage || 'An error occurred while processing your request.';
    Utility.alertMessage(Utility.icons[0], Utility.titles[2], errorMessage);
  }
}
