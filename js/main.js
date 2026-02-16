// ========== 네비게이션 스크롤 효과 ==========
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== 모바일 메뉴 토글 ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// 메뉴 링크 클릭 시 닫기
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ========== 스크롤 페이드인 애니메이션 ==========
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => observer.observe(el));

// ========== EmailJS 초기화 ==========
emailjs.init('_PF0Z2una6brPSaqj');

// ========== 상담 신청 폼 처리 ==========
const contactForm = document.getElementById('contactForm');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // 간단한 유효성 검사
  if (!data.name.trim()) {
    showFieldError('name', '이름을 입력해 주세요.');
    return;
  }

  if (!data.phone.trim()) {
    showFieldError('phone', '연락처를 입력해 주세요.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = '전송 중...';

  // EmailJS로 이메일 전송
  emailjs.send('service_zn9vpo6', 'template_y5j8h8m', {
    name: data.name,
    phone: data.phone,
    accident_type: data.accident_type || '미선택',
    message: data.message || '없음'
  }).then(() => {
    modalOverlay.classList.add('active');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = '무료 상담 신청하기';
  }).catch((err) => {
    alert('전송에 실패했습니다. 전화(010-4107-2831)로 문의해 주세요.');
    submitBtn.disabled = false;
    submitBtn.textContent = '무료 상담 신청하기';
  });
});

// 모달 닫기
modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    modalOverlay.classList.remove('active');
  }
});

// ========== 필드 에러 표시 ==========
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = '#E74C3C';
  field.focus();

  // 기존 에러 메시지 제거
  const existingError = field.parentElement.querySelector('.field-error');
  if (existingError) existingError.remove();

  const errorEl = document.createElement('span');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  errorEl.style.cssText = 'color:#E74C3C;font-size:0.8rem;margin-top:4px;display:block;';
  field.parentElement.appendChild(errorEl);

  field.addEventListener('input', function handler() {
    field.style.borderColor = '';
    const err = field.parentElement.querySelector('.field-error');
    if (err) err.remove();
    field.removeEventListener('input', handler);
  });
}

// ========== 전화번호 자동 포맷 ==========
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '');

  if (value.length > 3 && value.length <= 7) {
    value = value.slice(0, 3) + '-' + value.slice(3);
  } else if (value.length > 7) {
    value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
  }

  e.target.value = value;
});
