LIBS = space.js comment.js fizzbuzz.js number.js

.SUFFIXES: .ast.js .js .peggy
%.js: %.peggy
	npx peggy --allowed-start-rules '*' $<
%.ast.js: %.peggy
	../../tools/ast.js $< > $@

.PHONY: all
all: fizzbuzz.js fizzbuzz_import.js csv.js
ast: fizzbuzz.ast.js fizzbuzz_import.ast.js csv.ast.js

fizzbuzz_import.js: fizzbuzz_import.peggy $(LIBS)
	npx peggy $<

comment.js: space.js

.PHONY: clean
clean:
	$(RM) *.js
