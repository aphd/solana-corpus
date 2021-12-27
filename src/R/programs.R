##########à##########à#####
##### Program Length ######
##########à##########à#####

df <- read.csv('~/github/aphd/solana-corpus/data/csv/programsInfo.csv')
df$programLength <- sapply(strsplit(df$DataLength, ' '), '[', 1)
df$programLength <- as.numeric(as.character(df$programLength))

library(ggplot2)
library(dplyr)
ggplot(df, aes(x=programLength)) + geom_histogram() + stat_bin(aes(y=..count.., label=..count..), binwidth=100000) + xlab("program length [bytes]")

# violin plot
ggplot(df, aes(x="", y=programLength, label="program length [bytes]")) + geom_violin() + geom_violin(draw_quantiles = c(0.25, 0.5, 0.75))

##########à##########à#####
##### Program Balance #####
##########à##########à#####
library(dplyr)
library(ggplot2)

df <- read.csv('~/github/aphd/solana-corpus/data/csv/programsInfo.csv')
df <- filter(df, df$Balance != "NA" & df$Balance != "n/a")
df$programBalance <- sapply(strsplit(df$Balance, ' '), '[', 1)
df$programBalance <- as.numeric(as.character(df$programBalance))

ggplot(df, aes(x=programBalance)) + geom_histogram() + stat_bin(aes(y=..count.., label=..count..), binwidth=0.1) + xlab("program balace [SOL]")

# violin plot
df <- read.csv('~/github/aphd/solana-corpus/data/csv/programsInfo.csv')
df <- filter(df, df$Balance != "NA" & df$Balance != "n/a")
df$programBalance <- sapply(strsplit(df$Balance, ' '), '[', 1)
df$programBalance <- as.numeric(as.character(df$programBalance))
