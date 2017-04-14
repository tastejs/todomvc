/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'app/main/viewmodels/mainViewModel',
    'scalejs!application'
], function (core, mainViewModel) {
    describe('`mainViewModel`', function () {
        var vm = mainViewModel(core.buildSandbox('main.test'));

        it('text is set to "Hello World" after initialization.', function () {
            expect(vm).toBeDefined();
            expect(vm.text()).toBe('Hello World');
        });
    });
});