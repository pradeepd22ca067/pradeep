/ Smooth scrolling functionality with highlighting active section
document.addEventListener('DOMContentLoaded', function() 
{
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    const sections = document.querySelectorAll('.section');
  
    for (const link of smoothScrollLinks) {
      link.addEventListener('click', smoothScroll);
    }
  
    window.addEventListener('scroll', highlightSection);
  
    function smoothScroll(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
  
      if (targetSection) {
        const offsetTop = targetSection.offsetTop;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  
    function highlightSection() {
      let scrollPosition = window.scrollY;
  
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
  
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const id = section.getAttribute('id');
          document.querySelector('.navbar a[href="#' + id + '"]').classList.add('active');
        } else {
          const id = section.getAttribute('id');
          document.querySelector('.navbar a[href="#' + id + '"]').classList.remove('active');
        }
      });
    }
  });