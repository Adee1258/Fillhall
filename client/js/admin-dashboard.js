// ===== AUTH CHECK =====
let token = localStorage.getItem('token');
let editingId = null;

if (!token) {
  window.location.href = 'admin-login.html';
}

// ===== LOGOUT =====
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'admin-login.html';
});

// ===== TOAST =====
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = isError
    ? 'linear-gradient(135deg,#dc3545,#a71d2a)'
    : 'linear-gradient(135deg,#d4af37,#f1d670)';
  toast.style.color = isError ? '#fff' : '#2d0008';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== LOGO PREVIEW =====
function previewLogo(input) {
  const wrap = document.getElementById('logoPreviewWrap');
  const img  = document.getElementById('logoPreview');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      wrap.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    wrap.style.display = 'none';
  }
}
window.previewLogo = previewLogo; // expose for inline onchange

// ===== FETCH STATS =====
async function fetchStats() {
  try {
    const res = await fetch('/api/listings/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    const stats = await res.json();
    document.getElementById('totalListings').textContent   = stats.total    || 0;
    document.getElementById('activeListings').textContent  = stats.active   || 0;
    document.getElementById('inactiveListings').textContent= stats.inactive || 0;
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// ===== FETCH LISTINGS TABLE =====
async function fetchListings() {
  try {
    const res = await fetch('/api/listings/admin', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    const listings = await res.json();
    renderTable(listings);
  } catch (err) {
    console.error('Listings error:', err);
    document.getElementById('listingsTable').innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:#ff6b7a;padding:1.5rem;">Error loading data. Check server.</td></tr>';
  }
}

// ===== RENDER TABLE =====
function renderTable(listings) {
  const tbody = document.getElementById('listingsTable');
  tbody.innerHTML = '';

  if (!listings || listings.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:rgba(255,255,255,0.5);padding:2rem;">Koi venue nahi mila. "+ Add New Venue" se add karein.</td></tr>';
    return;
  }

  listings.forEach(listing => {
    const logoSrc = listing.logo
      ? (listing.logo.startsWith('http') ? listing.logo : `/uploads/${listing.logo}`)
      : null;
    const logoHTML = logoSrc
      ? `<img class="table-logo" src="${logoSrc}" alt="logo" onerror="this.style.display='none'">`
      : `<span class="no-logo-icon">🏛️</span>`;

    const guestMin = listing.guest_capacity_min || '';
    const guestMax = listing.guest_capacity_max || listing.guest_capacity || '';
    const guestDisplay = guestMin || guestMax
      ? `${guestMin}–${guestMax} PAX`
      : '—';

    const statusClass = listing.status === 'active' ? 'active' : 'inactive';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${logoHTML}</td>
      <td><strong style="color:#d4af37">${listing.business_name}</strong></td>
      <td>${listing.location || '—'}</td>
      <td>${guestDisplay}</td>
      <td>${listing.budget || '—'}</td>
      <td>${listing.whatsapp_number}</td>
      <td><span class="status-badge ${statusClass}">${listing.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="edit-btn" onclick="editListing('${listing._id}')">Edit</button>
          <button class="delete-btn" onclick="deleteListing('${listing._id}', '${listing.business_name}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== MODAL OPEN/CLOSE =====
const modal      = document.getElementById('listingModal');
const modalTitle = document.getElementById('modalTitle');
const form       = document.getElementById('listingForm');

document.getElementById('addListingBtn').addEventListener('click', () => {
  editingId = null;
  modalTitle.textContent = 'Add New Venue';
  form.reset();
  document.getElementById('listingId').value = '';
  document.getElementById('logoPreviewWrap').style.display = 'none';
  modal.classList.add('active');
});

function closeModal() { modal.classList.remove('active'); }
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ===== EDIT LISTING =====
async function editListing(id) {
  try {
    const res = await fetch(`/api/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Not found');
    const listing = await res.json();

    editingId = id;
    modalTitle.textContent = 'Edit Venue';

    document.getElementById('listingId').value       = id;
    document.getElementById('businessName').value    = listing.business_name   || '';
    document.getElementById('location').value        = listing.location        || '';
    document.getElementById('guestMin').value        = listing.guest_capacity_min || listing.guest_capacity || '';
    document.getElementById('guestMax').value        = listing.guest_capacity_max || '';
    document.getElementById('budget').value          = listing.budget          || '';
    document.getElementById('whatsappNumber').value  = listing.whatsapp_number || '';
    document.getElementById('status').value          = listing.status          || 'active';

    // Show existing logo
    const previewWrap = document.getElementById('logoPreviewWrap');
    const previewImg  = document.getElementById('logoPreview');
    if (listing.logo) {
      previewImg.src = listing.logo.startsWith('http')
        ? listing.logo
        : `/uploads/${listing.logo}`;
      previewWrap.style.display = 'block';
    } else {
      previewWrap.style.display = 'none';
    }

    modal.classList.add('active');
  } catch (err) {
    console.error('Edit error:', err);
    showToast('Venue load karne mein error aaya.', true);
  }
}
window.editListing = editListing;

// ===== DELETE LISTING =====
async function deleteListing(id, name) {
  if (!confirm(`"${name}" ko delete karna chahte hain? Yeh wapas nahi aayega.`)) return;
  try {
    const res = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      showToast(`"${name}" delete ho gaya.`);
      fetchStats();
      fetchListings();
    } else {
      showToast('Delete fail ho gaya.', true);
    }
  } catch (err) {
    showToast('Server error.', true);
  }
}
window.deleteListing = deleteListing;

// ===== FORM SUBMIT (Create / Update) =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled    = true;

  const formData = new FormData();
  formData.append('business_name',       document.getElementById('businessName').value.trim());
  formData.append('location',            document.getElementById('location').value.trim());
  formData.append('guest_capacity_min',  document.getElementById('guestMin').value);
  formData.append('guest_capacity_max',  document.getElementById('guestMax').value);
  // Keep legacy guest_capacity as max for backward compat
  formData.append('guest_capacity',      document.getElementById('guestMax').value || document.getElementById('guestMin').value);
  formData.append('budget',              document.getElementById('budget').value.trim());
  formData.append('whatsapp_number',     document.getElementById('whatsappNumber').value.trim());
  formData.append('status',              document.getElementById('status').value);

  const logoFile = document.getElementById('logo').files[0];
  if (logoFile) {
    formData.append('logo', logoFile);
  }

  try {
    let res;
    if (editingId) {
      res = await fetch(`/api/listings/${editingId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    } else {
      res = await fetch('/api/listings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    }

    if (res.ok) {
      closeModal();
      showToast(editingId ? 'Venue update ho gaya! ✓' : 'Naya venue add ho gaya! ✓');
      fetchStats();
      fetchListings();
    } else {
      const err = await res.json();
      showToast(err.message || 'Save fail ho gaya.', true);
    }
  } catch (err) {
    console.error('Save error:', err);
    showToast('Server se connect nahi ho saka.', true);
  } finally {
    saveBtn.textContent = 'Save Venue';
    saveBtn.disabled    = false;
  }
});

// ===== INIT =====
fetchStats();
fetchListings();
