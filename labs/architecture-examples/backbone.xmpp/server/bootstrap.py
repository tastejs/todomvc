##############################################################################
#
# Copyright (c) 2006 Zope Foundation and Contributors.
# All Rights Reserved.
#
# This software is subject to the provisions of the Zope Public License,
# Version 2.1 (ZPL).  A copy of the ZPL should accompany this distribution.
# THIS SOFTWARE IS PROVIDED "AS IS" AND ANY AND ALL EXPRESS OR IMPLIED
# WARRANTIES ARE DISCLAIMED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF TITLE, MERCHANTABILITY, AGAINST INFRINGEMENT, AND FITNESS
# FOR A PARTICULAR PURPOSE.
#
##############################################################################
"""Bootstrap a buildout-based project

Simply run this script in a directory containing a buildout.cfg.
The script accepts buildout command-line options, so you can
use the -c option to specify an alternate configuration file.

$Id$
"""

import os, shutil, sys, tempfile, urllib2
from optparse import OptionParser

tmpeggs = tempfile.mkdtemp()

is_jython = sys.platform.startswith('java')

# parsing arguments
parser = OptionParser(
    'This is a custom version of the zc.buildout %prog script.  It is '
    'intended to meet a temporary need if you encounter problems with '
    'the zc.buildout 1.5 release.')
parser.add_option("-v", "--version", dest="version", default='1.5.2',
                          help='Use a specific zc.buildout version.  *This '
                          'bootstrap script defaults to '
                          '1.5.2, unlike usual buildout bootstrap scripts.*')
parser.add_option("-d", "--distribute",
                   action="store_true", dest="distribute", default=True,
                   help="Use Disribute rather than Setuptools.")

parser.add_option("-c", None, action="store", dest="config_file",
                   help=("Specify the path to the buildout configuration "
                         "file to be used."))

options, args = parser.parse_args()

# if -c was provided, we push it back into args for buildout' main function
if options.config_file is not None:
    args += ['-c', options.config_file]

if options.version is not None:
    VERSION = '==%s' % options.version
else:
    VERSION = ''

USE_DISTRIBUTE = options.distribute
args = args + ['bootstrap']

to_reload = False
try:
    import pkg_resources
    if not hasattr(pkg_resources, '_distribute'):
        to_reload = True
        raise ImportError
except ImportError:
    ez = {}
    if USE_DISTRIBUTE:
        exec urllib2.urlopen('http://python-distribute.org/distribute_setup.py'
                         ).read() in ez
        ez['use_setuptools'](to_dir=tmpeggs, download_delay=0, no_fake=True)
    else:
        exec urllib2.urlopen('http://peak.telecommunity.com/dist/ez_setup.py'
                             ).read() in ez
        ez['use_setuptools'](to_dir=tmpeggs, download_delay=0)

    if to_reload:
        reload(pkg_resources)
    else:
        import pkg_resources

if sys.platform == 'win32':
    def quote(c):
        if ' ' in c:
            return '"%s"' % c # work around spawn lamosity on windows
        else:
            return c
else:
    def quote (c):
        return c

ws  = pkg_resources.working_set

if USE_DISTRIBUTE:
    requirement = 'distribute'
else:
    requirement = 'setuptools'

env = dict(os.environ,
           PYTHONPATH=
           ws.find(pkg_resources.Requirement.parse(requirement)).location
           )

cmd = [quote(sys.executable),
       '-c',
       quote('from setuptools.command.easy_install import main; main()'),
       '-mqNxd',
       quote(tmpeggs)]

if 'bootstrap-testing-find-links' in os.environ:
    cmd.extend(['-f', os.environ['bootstrap-testing-find-links']])

cmd.append('zc.buildout' + VERSION)

if is_jython:
    import subprocess
    exitcode = subprocess.Popen(cmd, env=env).wait()
else: # Windows prefers this, apparently; otherwise we would prefer subprocess
    exitcode = os.spawnle(*([os.P_WAIT, sys.executable] + cmd + [env]))
assert exitcode == 0

ws.add_entry(tmpeggs)
ws.require('zc.buildout' + VERSION)
import zc.buildout.buildout
zc.buildout.buildout.main(args)
shutil.rmtree(tmpeggs)
