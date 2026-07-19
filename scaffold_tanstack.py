import pexpect
import sys

child = pexpect.spawn('npx @tanstack/create-start@latest sentinai-tanstack', encoding='utf-8')
child.logfile = sys.stdout

try:
    # Handle npm confirmation if package needs to be installed
    i = child.expect(['Ok to proceed?', 'Select a template', pexpect.EOF, pexpect.TIMEOUT], timeout=30)
    if i == 0:
        child.sendline('y')
        child.expect(['Select a template'])
    
    # Handle template selection
    # The default is usually 'basic' or similar, we just press enter to accept the first/default
    child.sendline('')
    
    # Handle package manager selection (npm, pnpm, yarn, bun)
    child.expect(['package manager'])
    child.sendline('') # Default is usually npm
    
    child.expect(pexpect.EOF, timeout=120)
except Exception as e:
    print(f"Exception: {e}")
