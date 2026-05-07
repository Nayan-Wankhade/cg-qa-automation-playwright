#!/usr/bin/env python3
"""
key_derivation.py — QA Agent Skill
Converts a manual test step string into a stable selector map key.
Used to look up and store selectors consistently regardless of step phrasing.

Usage:
  python key_derivation.py "Click the New Result button"
  → new_result

  from scripts.key_derivation import derive_key
  key = derive_key("Fill in the Result Name field")
  → result_name
"""

import re
import sys

STOP_WORDS = {
    'click', 'the', 'a', 'an', 'on', 'to', 'in', 'at', 'into', 'and',
    'with', 'button', 'link', 'field', 'input', 'dropdown', 'select',
    'enter', 'fill', 'type', 'choose', 'pick', 'open', 'close', 'press',
    'from', 'this', 'that', 'verify', 'check', 'ensure', 'should', 'is',
    'are', 'will', 'be', 'by', 'for', 'of', 'it', 'its', 'upload', 'submit',
    'appears', 'message', 'row', 'first', 'last', 'next', 'visible', 'shown',
    'using', 'data', 'valid', 'invalid', 'text', 'option', 'item', 'list',
    'active', 'inactive', 'enabled', 'disabled', 'yes', 'no', 'true', 'false'
}

SEMANTIC_ALIASES = {
    # Normalise synonyms to a single key token
    'save':       'save',
    'submit':     'save',
    'confirm':    'save',
    'create':     'new',
    'add':        'new',
    'new':        'new',
    'delete':     'delete',
    'remove':     'delete',
    'edit':       'edit',
    'update':     'edit',
    'modify':     'edit',
    'cancel':     'cancel',
    'discard':    'cancel',
    'search':     'search',
    'filter':     'filter',
    'name':       'name',
    'title':      'name',
    'value':      'value',
    'amount':     'value',
    'date':       'date',
    'period':     'period',
    'indicator':  'indicator',
    'result':     'result',
    'status':     'status',
    'type':       'type',
    'evidence':   'evidence',
    'attachment': 'evidence',
    'file':       'evidence',
    'image':      'image',
    'photo':      'image',
    'logo':       'image',
}


def derive_key(step_text: str) -> str:
    """
    Convert a test step string to a stable selector map key.
    
    Examples:
      "Click the New Result button"      → "new_result"
      "Fill in Result Name"              → "result_name"
      "Select Indicator from dropdown"   → "indicator"
      "Upload evidence file"             → "evidence"
      "Click Save"                       → "save"
      "Verify success toast appears"     → "success_toast"
    """
    # Lowercase, strip punctuation
    text = re.sub(r"[^\w\s]", " ", step_text.lower())
    
    # Split to tokens
    tokens = text.split()
    
    # Remove stop words, apply aliases
    result_tokens = []
    for token in tokens:
        if token in STOP_WORDS:
            continue
        if re.match(r"^\d+$", token):
            continue
        token = SEMANTIC_ALIASES.get(token, token)
        if len(token) >= 2 and token not in result_tokens:
            result_tokens.append(token)
    
    # Max 3 meaningful tokens
    key = '_'.join(result_tokens[:3])
    
    # Fallback if empty
    if not key:
        key = re.sub(r'\W+', '_', step_text.lower())[:30]
    
    return key


def derive_page_slug(url_or_title: str) -> str:
    """
    Convert a page URL or title to a filename-safe slug.
    
    Examples:
      "/results/new"           → "result-management"
      "Result Management"      → "result-management"
      "/indicators"            → "indicator-management"
      "/login"                 → "login"
    """
    text = url_or_title.lower()
    
    # URL path hints
    if '/result' in text:     return 'result-management'
    if '/indicator' in text:  return 'indicator-management'
    if '/login' in text:      return 'login'
    if '/dashboard' in text:  return 'dashboard'
    if '/settings' in text:   return 'settings'
    if '/user' in text:       return 'user-management'
    if '/report' in text:     return 'reports'
    
    # Title fallback
    slug = re.sub(r'[^\w\s-]', '', text)
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')
    return slug[:50] or 'unknown-page'


if __name__ == '__main__':
    if len(sys.argv) > 1:
        step = ' '.join(sys.argv[1:])
        print(f"Step:  {step}")
        print(f"Key:   {derive_key(step)}")
    else:
        # Self-test
        cases = [
            ("Click the New Result button",          "new_result"),
            ("Fill in the Result Name field",         "result_name"),
            ("Select Indicator from dropdown",        "indicator"),
            ("Upload evidence file",                  "evidence"),
            ("Click Save",                            "save"),
            ("Enter value 450 in Value field",        "value"),
            ("Select Active from Status dropdown",    "status"),
            ("Click Edit button on first row",        "edit"),
            ("Verify success message appears",        "success"),
        ]
        print(f"{'Step':<50} {'Expected':<20} {'Got':<20} {'Pass'}")
        print("-" * 100)
        for step, expected, *_ in cases:
            got = derive_key(step)
            ok = "✓" if got == expected else "✗"
            print(f"{step:<50} {expected:<20} {got:<20} {ok}")
