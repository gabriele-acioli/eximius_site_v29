(() => {
  const section = document.querySelector('.mission-topics');
  const sourceList = section?.querySelector('.mission-topic-list');
  if (!section || !sourceList) return;

  const topics = [...sourceList.querySelectorAll('.mission-topic')];
  if (!topics.length) return;

  const editorial = document.createElement('div');
  editorial.className = 'mission-editorial reveal';
  editorial.setAttribute('aria-label', 'Diferenciais do Colégio EXIMIUS');

  const media = document.createElement('figure');
  media.className = 'mission-editorial-media';

  const image = document.createElement('img');
  image.decoding = 'async';
  media.appendChild(image);

  const list = document.createElement('div');
  list.className = 'mission-editorial-list';
  list.setAttribute('role', 'tablist');

  const items = topics.map((topic, index) => {
    const title = topic.querySelector('h3')?.textContent.trim() || '';
    const text = topic.querySelector('.mission-topic-panel > p')?.textContent.trim() || '';
    const sourceImage = topic.querySelector('.mission-topic-expanded-image img');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mission-editorial-item';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', 'false');
    button.innerHTML = `
      <span class="mission-editorial-title">
        <span class="mission-editorial-arrow" aria-hidden="true">›</span>
        <span>${title}</span>
      </span>
      <span class="mission-editorial-text">${text}</span>
    `;

    button.addEventListener('click', () => select(index));
    list.appendChild(button);

    return { button, sourceImage };
  });

  const select = index => {
    const current = items[index];
    if (!current) return;

    items.forEach((item, itemIndex) => {
      const active = itemIndex === index;
      item.button.classList.toggle('is-active', active);
      item.button.setAttribute('aria-selected', String(active));
    });

    if (current.sourceImage) {
      image.src = current.sourceImage.currentSrc || current.sourceImage.src;
      image.alt = current.sourceImage.alt || '';
      image.style.objectPosition = 
      index === 3 ? '0% 30%' : //Equipe docente qualificada
      index === 1 ? '0% 38%' : //Desenolvimento socioemocional
      (getComputedStyle(current.sourceImage).objectPosition || 'center');

      const flickr = current.sourceImage.dataset.flickrSource;
      if (flickr) image.dataset.flickrSource = flickr;

      media.classList.remove('is-updating');
      void media.offsetWidth;
      media.classList.add('is-updating');
    }
  };

  editorial.append(media, list);
  section.appendChild(editorial);
  document.body.classList.add('mission-editorial-ready');
  select(0);


  /* Entrada do bloco azul ao chegar na tela */
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if(reducedMotion){

    editorial.classList.add('in');

  }else{

    const editorialObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {
        entry.target.classList.toggle('in', entry.isIntersecting);
      });

    },{
      threshold:.08,
      rootMargin:'0px 0px -5% 0px'
    });

    editorialObserver.observe(editorial);

  }

  })();

/* Parceiros — duplica automaticamente a sequência para o loop infinito */
(function setupPartnersLoop(){

  const track = document.querySelector('.partner-track');
  if(!track) return;

  const original = track.querySelector('.partner-sequence');
  if(!original) return;

  if(track.querySelector('.partner-sequence[data-clone="true"]')) return;

  const clone = original.cloneNode(true);

  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('data-clone', 'true');

  clone.querySelectorAll('img').forEach(function(img){
    img.alt = '';
  });

  track.appendChild(clone);

})();
