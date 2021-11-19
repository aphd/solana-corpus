df <- read.csv('~/github/aphd/solana-corpus/data/csv/programsInfo.csv')

df[,c("ProgramId", "LastDeployedInSlot", "DataLength", "Balance")]
