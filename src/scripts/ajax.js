const allowedTags = ["h2","h3","h4","div","span","a","picture","source","img","ul","li","p","i","b","br","select","option","optgroup","input","label"];
const allowedAttributes = ["id","class","style","href","srcset","loading","title","alt","target","value","type","name","for","placeholder","checked"];


waitForElement('#store_controls #cart_status_data').then(function (element) {
    let title = document.createElement('h1');
    title.setAttribute('class', 'ag_changes_title');
    title.innerText = "Loading...";

    let xhr_data = document.createElement('div');
    xhr_data.setAttribute('class', 'alike_xhr_data');

    let container = document.createElement('div');
    container.setAttribute('class', 'ag_changes');
    container.appendChild(title);
    container.appendChild(xhr_data);

    let span = document.createElement('span');
    span.setAttribute('class', 'pulldownButton');
    span.innerText = "alike03's Subscription Info";
    
    let span2 = document.createElement('span');
    span2.setAttribute('class', 'pulldownButton pulldown');
    span.appendChild(span2);

    let button = document.createElement('div');
    button.setAttribute('id', 'ag_changes_button');
    button.setAttribute('class', 'store_header_btn store_header_btn_gray');

    button.appendChild(span);
    button.appendChild(container);

    if (save.options.menuToggle == 'mouseenter') {
        button.onmouseenter = function () {
            container.classList.remove('closed');
            container.classList.add('open');
        }
        button.onmouseleave = function () {
            container.classList.remove('open');
            container.classList.add('closed');
        }
    } else {
        button.onclick = function (e) {
            // Was preventing menu clicks
            if (!e.target.classList.contains('pulldownButton'))
                return;
            if (container.classList.contains('open')) {
                container.classList.remove('open');
                container.classList.add('closed');
            } else {
                container.classList.remove('closed');
                container.classList.add('open');
            }
        };
    }

    element.querySelectorAll('#ag_changes_button').forEach((oldButton) => { 
        oldButton.remove();
    });
    element.prepend(button);

    loadChanges(save.options.timeFrame);
});

function createElementsFromJSON(content, parent) {
    if (content.hasOwnProperty('element')) {
		// Validate if Tag is allowed
		let obj = parent;
		if (allowedTags.includes(content.element)) {
			// if tag is allowed set it as the default object
			obj = document.createElement(content.element);

			if (content.hasOwnProperty('attributes')) {
				for(let attr in content.attributes) {
					// check for allowed attributes and for src for images and for datasets
					if (
						allowedAttributes.includes(attr) ||
						(attr === 'src' && content.element === 'img') ||
						attr.startsWith('data-')
					) {
						obj.setAttribute(attr, content.attributes[attr]);
					}
				}
			}

			if (content.hasOwnProperty('text')) {
				obj.appendChild(document.createTextNode(content.text));
			}

			parent.appendChild(obj);
		}

        if (content.hasOwnProperty('children')) {
            if (Array.isArray(content.children)) {
                for (let child in content.children)
                    createElementsFromJSON(content.children[child], obj);
            } else {
                createElementsFromJSON(content.children, obj);
            }
        }
    } else if (Array.isArray(content)) {
        for (let child in content)
            createElementsFromJSON(content[child], parent);
    }
}