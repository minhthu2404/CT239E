import re

def update_html():
    with open('c:/Users/Admin/Documents/GitHub/CT239E/budget_page/budget.html', 'r', encoding='utf-8') as f:
        html = f.read()

    def replacer(match):
        category = match.group(1)
        return f'''<div class="action-buttons" style="display: flex; gap: 8px;">
                        <button type="button" class="adjust" data-category="{category}" title="Chỉnh sửa"><i
                                class="fa-solid fa-pencil"></i></button>
                        <button type="button" class="delete-budget" data-category="{category}" title="Xóa ngân sách" style="display: none;"><i
                                class="fa-solid fa-trash"></i></button>
                    </div>'''

    pattern = r'<button type="button" class="adjust" data-category="([^"]+)"><i\n\s*class="fa-solid fa-pencil"></i></button>'
    new_html = re.sub(pattern, replacer, html)

    with open('c:/Users/Admin/Documents/GitHub/CT239E/budget_page/budget.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

if __name__ == '__main__':
    update_html()
