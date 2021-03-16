
import icons from './icons';

function placeValue(template, classes, ...values) {
    values.forEach(value => template = template.replace(/\{\{\svalue-*\d*\s\}\}/, value));

    template = template.replace('{{ class }}', classes || '');

    return template.replace(/\{\{\svalue-*\d*\s\}\}/g, '');
}

function symbol(name) {
    return `<span class="symbol">${ icons[name] }</span>`;
}

let templates = {
    fraction: [
        `<div class="math fraction {{ class }}" contenteditable="false">
            <div class="place here" contenteditable="true">{{ value-1 }}</div>
            <div class="line"></div>
            <div class="place" contenteditable="true">{{ value-2 }}</div>
        </div>`,

        `<div class="math fraction {{ class }}" contenteditable="false">
            <div class="place here" contenteditable="true">{{ value-1 }}</div>
            <div class="line">
                <svg viewBox="0 0 10 20">
                    <line x1="0" y1="100%" x2="100%" y2="0" />
                </svg>
            </div>
            <div class="place" contenteditable="true">{{ value-2 }}</div>
        </div>`,
    ],
    script: [
        `<div class="math script {{ class }}" contenteditable="false">
            <div class="place here" contenteditable="true">{{ value-1 }}</div>
            <div class="place" contenteditable="true">{{ value-2 }}</div>
        </div>`,

        `<div class="math script {{ class }}" contenteditable="false">
            <div class="place here" contenteditable="true">{{ value-1 }}</div>
            <div class="script">
                <div class="place" contenteditable="true">{{ value-2 }}</div>
                <div class="place" contenteditable="true">{{ value-3 }}</div>
            </div>
        </div>`,
    ],
    radical: [
        `<div class="math radical type-1" contenteditable="false">
            <div class="left">
                <div class="bottom">
                    <div class="line">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="100" y1="100" x2="40" y1="0" />
                            <line x1="40" y1="0" x2="0" y1="0" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="center">
                <div class="line">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="100" x2="100" y1="0" />
                    </svg>
                </div>
            </div>

            <div class="right">
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-1 }}</span>
                </div>
            </div>
        </div>`,

        `<div class="math radical type-2" contenteditable="false">
            <div class="left">
                <div class="top">
                    <span class="place" contenteditable="true">{{ value-2 }}</span>
                </div>
                <div class="bottom">
                    <div class="line">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="100" y1="100" x2="40" y1="0" />
                            <line x1="40" y1="0" x2="0" y1="0" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="center">
                <div class="line">
                    <svg viewBox="0 0 50 100" preserveAspectRatio="none">
                        <line x1="0" y1="100" x2="50" y1="0" />
                    </svg>
                </div>
            </div>

            <div class="right">
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-2 }}</span>
                </div>
            </div>
        </div>`,
    ],
    limit: [
        `<div class="math {{ class }}" contenteditable="false">
            <div class="top">
                lim
                <span class="place here" contenteditable="true">{{ value-1 }}</span>
            </div>
            <div class="bottom">
                <span class="place" contenteditable="true">{{ value-2 }}</span>
            </div>
        </div>`,

        `<div class="math {{ class }}" contenteditable="false">
            log
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
        </div>`,

        `<div class="math {{ class }}" contenteditable="false">
            log
            <span class="place base" contenteditable="true">{{ value-2 }}</span>
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
        </div>`,

        `<div class="math {{ class }}" contenteditable="false">
            ln
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
        </div>`,
    ],
    integral: [
        `<div class="math {{ class }}" contenteditable="false">
            <div class="center">
                <div class="icon">${ icons.integral }</div>
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-1 }}</span>
                </div>
            </div>
        </div>
        `,

        `<div class="math {{ class }}" contenteditable="false">
            <div class="top">
                <span class="place" contenteditable="true">{{ value-2 }}</span>
            </div>
            <div class="center">
                <div class="icon">${ icons.integral }</div>
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-1 }}</span>
                </div>
            </div>
            <div class="bottom">
                <span class="place" contenteditable="true">{{ value-3 }}</span>
            </div>
        </div>
        `,

        `<div class="math {{ class }}" contenteditable="false">
            <div class="center">
                <div class="icon">${ icons.integral }</div>
                <div class="icon">${ icons.integral }</div>
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-1 }}</span>
                </div>
            </div>
        </div>
        `,
        
        `<div class="math {{ class }}" contenteditable="false">
            <div class="top">
                <span class="place" contenteditable="true">{{ value-2 }}</span>
            </div>
            <div class="center">
                <div class="icon">${ icons.integral }</div>
                <div class="icon">${ icons.integral }</div>
                <div class="compartment">
                    <span class="place here" contenteditable="true">{{ value-1 }}</span>
                </div>
            </div>
            <div class="bottom">
                <span class="place" contenteditable="true">{{ value-3 }}</span>
            </div>
        </div>
        `,
    ],
    sigma: [
        `<div class="math {{ class }}" contenteditable="false">
            <div class="center">
                <div class="icon">${ icons.sigma }</div>
                <span class="place here" contenteditable="true">{{ value-1 }}</span>
            </div>
        </div>
        `,

        `<div class="math {{ class }}" contenteditable="false">
            <div class="center">
                <div class="icon">${ icons.sigma }</div>
                <span class="place here" contenteditable="true">{{ value-1 }}</span>
            </div>
            <div class="bottom">
                <span class="place" contenteditable="true">{{ value-3 }}</span>
            </div>
        </div>
        `,

        `<div class="math {{ class }}" contenteditable="false">
            <div class="top">
                <span class="place" contenteditable="true">{{ value-2 }}</span>
            </div>
            <div class="center">
                <div class="icon">${ icons.sigma }</div>
                <span class="place here" contenteditable="true">{{ value-1 }}</span>
            </div>
            <div class="bottom">
                <span class="place" contenteditable="true">{{ value-3 }}</span>
            </div>
        </div>
        `,
    ],
    operator: [
        `<div class="math operator {{ class }}" contenteditable="false">
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
            <div class="arrow"></div>
        </div>`,

        `<div class="math operator {{ class }}" contenteditable="false">
            <div class="arrow"></div>
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
        </div>`,

        `<div class="math operator {{ class }}" contenteditable="false">
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
            <div class="arrow"></div>
            <span class="place" contenteditable="true">{{ value-2 }}</span>
        </div>`,
    ],
    functions: [
        `<div class="math function {{ class }}" contenteditable="false">
            {{ value-1 }}
            <span class="place here" contenteditable="true">{{ value-2 }}</span>
        </div>`,
    ],
    container: [
        `<div class="math container {{ class }}" contenteditable="false">
            <span class="line></span>
            <span class="place here" contenteditable="true">{{ value-1 }}</span>
            <span class="line"></span>
        </div>`,
    ],
};

let equations = {
    fraction: {
        name: 'fraction',
        title: 'کسر',
        templates: [
            {
                title: 'کسر',
                template: placeValue(templates.fraction[0], 'type-1'),
            },
            {
                title: 'کسر خطی',
                template: placeValue(templates.fraction[1], 'type-2'),
            },
            {
                title: 'کسر کج',
                template: placeValue(templates.fraction[1], 'type-3'),
            },
            {
                title: 'کسر کوچک',
                template: placeValue(templates.fraction[0], 'type-1 type-4'),
            },
        ],
        examples: [
            {
                title: 'پی دوم',
                template: placeValue(templates.fraction[0], 'type-1', symbol('pi'), 2),
            }
        ],
    },
    script: {
        name: 'radical',
        title: 'توان',
        templates: [
            {
                title: 'توان',
                template: placeValue(templates.script[0], 'exponent'),
            },
            {
                title: 'اندیس',
                template: placeValue(templates.script[0], 'index'),
            },
            {
                title: 'فرمول شیمیایی',
                template: placeValue(templates.script[1], 'chemistry'),
            },
        ],
        examples: [
            {
                title: 'دو پی',
                template: placeValue(templates.script[0], 'exponent', symbol('pi'), '2'),
            },
            {
                title: 'سهمی',
                template: placeValue(templates.script[0], 'exponent', symbol('x'), '2'),
            },
        ],
    },
    radical: {
        name: 'radical',
        title: 'رادیکال',
        templates: [
            {
                title: 'رادیکال',
                template: placeValue(templates.radical[0]),
            },
            {
                title: 'رادیکال با فورجه',
                template: placeValue(templates.radical[1]),
            },
            {
                title: 'رادیکال با فورجه دو',
                template: placeValue(templates.radical[1], '', '2'),
            },
            {
                title: 'رادیکال با فورجه سه',
                template: placeValue(templates.radical[1], '', '3'),
            },
        ],
        examples: [
            {
                title: 'فیثاغورس',
                template: placeValue(templates.radical[0], '',
                    `
                    ${ placeValue(templates.script[0], 'exponent', symbol('x'), '2') } +
                    ${ placeValue(templates.script[0], 'exponent', symbol('y'), '2') }
                    `
                    ),
            }
        ],
    },
    limit: {
        name: 'limit',
        title: 'حد و لگاریتم',
        templates: [
            {
                title: 'حد',
                template: placeValue(templates.limit[0], 'limit'),
            },
            {
                title: 'لگاریتم',
                template: placeValue(templates.limit[1], 'log'),
            },
            {
                title: 'لگاریتم',
                template: placeValue(templates.limit[2], 'log'),
            },
            {
                title: 'لگاریتم',
                template: placeValue(templates.limit[3], 'log'),
            },
        ],
        examples: [
            {
                title: '',
                template: placeValue(templates.limit[0], 'limit', '', placeValue(templates.operator[2], 'single-arrow arrow-right limit-to')),
            },
            {
                title: '',
                template: placeValue(templates.limit[0], 'limit', '', placeValue(templates.operator[2], 'single-arrow arrow-right limit-to', '', symbol('infinite'))),
            }
        ],
    },
    integral: {
        name: 'integral',
        title: 'انتگرال',
        templates: [
            {
                title: 'انتگرال',
                template: placeValue(templates.integral[0], 'integral'),
            },
            {
                title: 'انتگرال',
                template: placeValue(templates.integral[1], 'integral'),
            },
            {
                title: 'انتگرال دوگانه',
                template: placeValue(templates.integral[2], 'integral double'),
            },
            {
                title: 'انتگرال دوگانه',
                template: placeValue(templates.integral[3], 'integral double'),
            },
        ],
        examples: [
            {
                title: 'integral',
                template: placeValue(templates.integral[1], 'integral', '', 
                `${ symbol('differential') } ${ symbol('x') }`,
                ''),
            }
        ],
    },
    sigma: {
        name: 'sigma',
        title: 'سیگما',
        templates: [
            {
                title: 'سیگما',
                template: placeValue(templates.sigma[0], 'sigma'),
            },
            {
                title: 'سیگما',
                template: placeValue(templates.sigma[1], 'sigma'),
            },
            {
                title: 'سیگما',
                template: placeValue(templates.sigma[2], 'sigma'),
            },
        ],
        examples: [
            {
                title: 'sigma',
                template: placeValue(templates.sigma[2], 'sigma', 'n', '', 'i = 0'),
            }
        ],
    },
    operator: {
        name: 'operator',
        title: 'عملگر',
        templates: [
            {
                title: 'نتیجه به راست',
                template: placeValue(templates.operator[0], 'double-arrow arrow-right arrow-bottom'),
            },
            {
                title: 'نتیجه به چپ',
                template: placeValue(templates.operator[0], 'double-arrow arrow-left arrow-bottom'),
            },
            {
                title: 'نتیجه به راست',
                template: placeValue(templates.operator[1], 'double-arrow arrow-right arrow-top'),
            },
            {
                title: 'نتیجه به چپ',
                template: placeValue(templates.operator[1], 'double-arrow arrow-left arrow-top'),
            },
            {
                title: 'نتیجه به راست',
                template: placeValue(templates.operator[0], 'single-arrow arrow-right arrow-bottom'),
            },
            {
                title: 'نتیجه به چپ',
                template: placeValue(templates.operator[0], 'single-arrow arrow-left arrow-bottom'),
            },
            {
                title: 'نتیجه به راست',
                template: placeValue(templates.operator[1], 'single-arrow arrow-right arrow-top'),
            },
            {
                title: 'نتیجه به چپ',
                template: placeValue(templates.operator[1], 'single-arrow arrow-left arrow-top'),
            },
            {
                title: 'به سمت راست',
                template: placeValue(templates.operator[2], 'single-arrow arrow-right limit-to'),
            },
        ],
        examples: [
            {
                title: 'اختلاف',
                template: placeValue(templates.operator[0], 'single-arrow arrow-right arrow-bottom', symbol('delta')),
            }
        ],
    },
    functions: {
        name: 'function',
        title: 'تابع',
        templates: [
            {
                title: 'سینوس',
                template: placeValue(templates.functions[0], 'sin', 'sin'),
            },
            {
                title: 'کسینوس',
                template: placeValue(templates.functions[0], 'cos', 'cos'),
            },
            {
                title: 'تانژانت',
                template: placeValue(templates.functions[0], 'tan', 'tan'),
            },
            {
                title: 'کتانژانت',
                template: placeValue(templates.functions[0], 'cot', 'cot'),
            },
            {
                title: 'کتانژانت',
                template: placeValue(templates.functions[0], 'sin', placeValue(templates.script[0], 'exponent', 'sin', '-1')),
            },
        ],
        examples: [
            {
                title: 'سینوس تتا',
                template: placeValue(templates.functions[0], 'sin', 'sin', symbol('theta')),
            },
            {
                title: '',
                template: placeValue(templates.functions[0], 'cos', 'cos', '2' + symbol('x')),
            }
        ],
    },
};

export default equations;
