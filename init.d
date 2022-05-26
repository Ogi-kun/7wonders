import std.stdio;
import std.file;
import std.path;
import std.regex;
import std.array;
import std.algorithm.searching;

void main(string[] args) {
	if (args.length < 3) {
		writeln("usage: init index.html.template fr");
		return;
	}
	auto src = args[1];

	if (!src.exists || !src.isFile) {
		writeln("Error: ", src, " does not exit");
	}

	auto locale = args[2];

	string[] messages;
	auto pattern = regex(`\$\{(.*)\}`); 
	foreach (match; src.readText.matchAll(pattern)) {
		auto msg = match[1];
		switch (msg) {
			case "LANG":
			case "LANGSELECTOR":
				break;
			default:
				if (messages.find(msg).empty) {
					messages ~= msg;
				}
		}
		
	}

	auto transDir = "languages";

	mkdirRecurse(transDir);
	auto file = File(chainPath(transDir, locale.setExtension("tr")), "w");
	foreach (msg; messages) {
		file.writeln("msgid ", msg);
		file.writeln("msgstr ");
		file.writeln;
	}
}